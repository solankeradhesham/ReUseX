import 'dotenv/config';
import bcrypt from 'bcryptjs';
import MongoStore from 'connect-mongo';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { resolve } from 'node:path';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const mongoUri = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;

if (!mongoUri) throw new Error('MONGODB_URI must be set before starting the server.');
if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error('SESSION_SECRET must be set to a random value of at least 32 characters.');
}

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    address: { type: String, default: '', maxlength: 240 },
    savedAdIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
  },
  { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema);
const listingSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    sellerName: { type: String, required: true, trim: true },
    sellerPhone: { type: String, default: '' },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 1 },
    isNegotiable: { type: Boolean, default: false },
    categoryId: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      locality: { type: String, required: true, trim: true },
      pincode: { type: String, trim: true, default: '' }
    },
    condition: { type: String, enum: ['New', 'Like New', 'Gently Used', 'Used - Fair'], required: true },
    urgent: { type: Boolean, default: false },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'sold', 'under_review'], default: 'active', index: true }
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
const chatMessageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    senderName: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    adTitle: { type: String, required: true },
    adPrice: { type: Number, required: true },
    adImage: { type: String, default: '' },
    lastMessage: { type: String, default: '' },
    messages: { type: [chatMessageSchema], default: [] }
  },
  { timestamps: true }
);

conversationSchema.index({ listingId: 1, buyerId: 1 }, { unique: true });
conversationSchema.index({ buyerId: 1, updatedAt: -1 });
conversationSchema.index({ sellerId: 1, updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const cookieName = 'reusex.sid';
const sessionDuration = 7 * 24 * 60 * 60 * 1000;

if (isProduction) app.set('trust proxy', 1);

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(
  session({
    name: cookieName,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoUri, collectionName: 'sessions', ttl: sessionDuration / 1000 }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: sessionDuration
    }
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Please try again in 15 minutes.' }
});

function toPublicUser(account: {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  createdAt: Date;
}) {
  return {
    id: account._id.toString(),
    name: account.name,
    email: account.email,
    phone: account.phone,
    city: account.city,
    address: account.address || '',
    memberSince: account.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    verified: false,
    role: 'buyer' as const
  };
}

function regenerateSession(req: express.Request) {
  return new Promise<void>((resolvePromise, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolvePromise()));
  });
}

function saveSession(req: express.Request) {
  return new Promise<void>((resolvePromise, reject) => {
    req.session.save((error) => (error ? reject(error) : resolvePromise()));
  });
}

function requireAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Please sign in to manage listings.' });
    return;
  }

  Account.findById(req.session.userId)
    .then((account) => {
      if (!account) {
        res.status(401).json({ error: 'Please sign in to manage listings.' });
        return;
      }
      res.locals.account = account;
      next();
    })
    .catch(next);
}

function toPublicListing(listing: InstanceType<typeof Listing>) {
  const postedAt = listing.createdAt;
  const age = Date.now() - postedAt.getTime();
  const postedLabel = age < 60_000 ? 'Just now' : age < 3_600_000
    ? `${Math.floor(age / 60_000)} minutes ago`
    : age < 86_400_000
      ? `${Math.floor(age / 3_600_000)} hours ago`
      : postedAt.toLocaleDateString();

  const { sellerName, sellerPhone, ...listingData } = listing.toObject();
  return {
    ...listingData,
    id: listing._id.toString(),
    ownerId: listing.ownerId.toString(),
    postedAt: postedLabel,
    featured: false,
    verified: false,
    seller: {
      id: listing.ownerId.toString(),
      name: sellerName,
      avatar: '',
      memberSince: '',
      verified: false,
      phone: sellerPhone,
      responseRate: '',
      rating: 0,
      totalReviews: 0,
      activeAdsCount: 0,
      isOnline: false
    }
  };
}

function toPublicConversation(conversation: InstanceType<typeof Conversation>, accountId: string) {
  const buyer = conversation.buyerId as unknown as { _id: mongoose.Types.ObjectId; name: string };
  const seller = conversation.sellerId as unknown as { _id: mongoose.Types.ObjectId; name: string };
  const isBuyer = buyer._id.toString() === accountId;
  const otherAccount = isBuyer ? seller : buyer;
  return {
    id: conversation._id.toString(),
    adId: conversation.listingId.toString(),
    adTitle: conversation.adTitle,
    adPrice: conversation.adPrice,
    adImage: conversation.adImage,
    lastMessage: conversation.lastMessage,
    updatedAt: conversation.updatedAt,
    otherUser: {
      id: otherAccount._id.toString(),
      name: otherAccount.name
    },
    messages: conversation.messages.map((message) => ({
      id: message._id.toString(),
      senderId: message.senderId.toString(),
      senderName: message.senderName,
      text: message.text,
      createdAt: message.createdAt
    }))
  };
}

app.get('/api/ads', async (_req, res, next) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json({ ads: listings.map(toPublicListing) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/ads', requireAccount, async (req, res, next) => {
  try {
    const account = res.locals.account as InstanceType<typeof Account>;
    const body = req.body;
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const price = Number(body.price);
    const images = Array.isArray(body.images)
      ? body.images.filter((image: unknown): image is string => typeof image === 'string' && image.startsWith('https://')).slice(0, 10)
      : [];

    if (!title || title.length > 120 || !description || description.length > 5000 || !Number.isFinite(price) || price < 1) {
      res.status(400).json({ error: 'Enter a title, description, and valid price.' });
      return;
    }
    if (images.length === 0) {
      res.status(400).json({ error: 'Add at least one HTTPS image URL for your listing.' });
      return;
    }
    if (!body.location || !body.location.city || !body.location.locality) {
      res.status(400).json({ error: 'Enter the listing city and locality.' });
      return;
    }

    const listing = await Listing.create({
      ownerId: account._id,
      title,
      description,
      price,
      isNegotiable: Boolean(body.isNegotiable),
      categoryId: body.categoryId,
      subcategory: body.subcategory,
      images,
      location: body.location,
      condition: body.condition,
      urgent: Boolean(body.urgent),
      specs: body.specs && typeof body.specs === 'object' ? body.specs : {},
      sellerName: account.name,
      sellerPhone: account.phone
    });
    res.status(201).json({ ad: toPublicListing(listing) });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/ads/:id', requireAccount, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid listing ID.' });
      return;
    }

    const account = res.locals.account as InstanceType<typeof Account>;
    const updates: Record<string, unknown> = {};
    if (typeof req.body.price === 'number' && Number.isFinite(req.body.price) && req.body.price > 0) {
      updates.price = req.body.price;
    }
    if (['active', 'sold', 'under_review'].includes(req.body.status)) {
      updates.status = req.body.status;
    }
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No valid listing changes provided.' });
      return;
    }

    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, ownerId: account._id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!listing) {
      res.status(404).json({ error: 'Listing not found for this account.' });
      return;
    }
    res.json({ ad: toPublicListing(listing) });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/ads/:id', requireAccount, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid listing ID.' });
      return;
    }
    const account = res.locals.account as InstanceType<typeof Account>;
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, ownerId: account._id });
    if (!listing) {
      res.status(404).json({ error: 'Listing not found for this account.' });
      return;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get('/api/chats', requireAccount, async (_req, res, next) => {
  try {
    const account = res.locals.account as InstanceType<typeof Account>;
    const conversations = await Conversation.find({
      $or: [{ buyerId: account._id }, { sellerId: account._id }]
    })
      .populate('buyerId', '_id name')
      .populate('sellerId', '_id name')
      .sort({ updatedAt: -1 });
    res.json({ conversations: conversations.map((conversation) => toPublicConversation(conversation, account._id.toString())) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/chats', requireAccount, async (req, res, next) => {
  try {
    const account = res.locals.account as InstanceType<typeof Account>;
    const listingId = typeof req.body.adId === 'string' ? req.body.adId : '';
    if (!mongoose.isValidObjectId(listingId)) {
      res.status(400).json({ error: 'Invalid listing ID.' });
      return;
    }

    const listing = await Listing.findOne({ _id: listingId, status: 'active' });
    if (!listing) {
      res.status(404).json({ error: 'This listing is no longer available.' });
      return;
    }
    if (listing.ownerId.toString() === account._id.toString()) {
      res.status(400).json({ error: 'You cannot start a conversation with yourself.' });
      return;
    }

    let conversation;
    try {
      conversation = await Conversation.findOneAndUpdate(
        { listingId: listing._id, buyerId: account._id },
        {
          $setOnInsert: {
            listingId: listing._id,
            buyerId: account._id,
            sellerId: listing.ownerId,
            adTitle: listing.title,
            adPrice: listing.price,
            adImage: listing.images[0] || ''
          }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } catch (error) {
      if (!(error instanceof mongoose.mongo.MongoServerError) || error.code !== 11000) throw error;
      conversation = await Conversation.findOne({ listingId: listing._id, buyerId: account._id });
    }

    if (!conversation) {
      res.status(500).json({ error: 'Could not start the conversation.' });
      return;
    }

    const populated = await Conversation.findById(conversation._id)
      .populate('buyerId', '_id name')
      .populate('sellerId', '_id name');
    res.status(200).json({ conversation: toPublicConversation(populated!, account._id.toString()) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/chats/:id/messages', requireAccount, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid conversation ID.' });
      return;
    }
    const account = res.locals.account as InstanceType<typeof Account>;
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text || text.length > 2000) {
      res.status(400).json({ error: 'Message must contain 1 to 2000 characters.' });
      return;
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      $or: [{ buyerId: account._id }, { sellerId: account._id }]
    });
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }

    conversation.messages.push({ senderId: account._id, senderName: account.name, text });
    conversation.lastMessage = text;
    await conversation.save();

    const populated = await Conversation.findById(conversation._id)
      .populate('buyerId', '_id name')
      .populate('sellerId', '_id name');
    res.status(201).json({ conversation: toPublicConversation(populated!, account._id.toString()) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      res.json({ user: null });
      return;
    }

    const account = await Account.findById(req.session.userId);
    if (!account) {
      req.session.destroy(() => undefined);
      res.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', secure: isProduction });
      res.json({ user: null });
      return;
    }

    res.json({ user: toPublicUser(account) });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/auth/me', requireAccount, async (req, res, next) => {
  try {
    const account = res.locals.account as InstanceType<typeof Account>;
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
    const city = typeof req.body.city === 'string' ? req.body.city.trim() : '';
    const address = typeof req.body.address === 'string' ? req.body.address.trim() : '';

    if (name.length < 2 || name.length > 80) {
      res.status(400).json({ error: 'Enter a name between 2 and 80 characters.' });
      return;
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' });
      return;
    }
    if (phone.length > 32 || city.length > 80 || address.length > 240) {
      res.status(400).json({ error: 'Phone, city, or address is too long.' });
      return;
    }
    if (await Account.exists({ _id: { $ne: account._id }, email })) {
      res.status(409).json({ error: 'An account with that email already exists.' });
      return;
    }

    account.name = name;
    account.email = email;
    account.phone = phone;
    account.city = city;
    account.address = address;
    await account.save();
    await Listing.updateMany(
      { ownerId: account._id },
      { $set: { sellerName: account.name, sellerPhone: account.phone } }
    );
    res.json({ user: toPublicUser(account) });
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      res.status(409).json({ error: 'An account with that email already exists.' });
      return;
    }
    next(error);
  }
});

app.get('/api/auth/favorites', requireAccount, (_req, res) => {
  const account = res.locals.account as InstanceType<typeof Account>;
  res.json({ savedAdIds: account.savedAdIds.map((id) => id.toString()) });
});

app.put('/api/auth/favorites', requireAccount, async (req, res, next) => {
  try {
    const account = res.locals.account as InstanceType<typeof Account>;
    const ids: unknown = req.body.savedAdIds;
    if (!Array.isArray(ids) || ids.length > 500 || ids.some((id) => typeof id !== 'string' || !mongoose.isValidObjectId(id))) {
      res.status(400).json({ error: 'Favorite listings are invalid.' });
      return;
    }

    const uniqueIds = [...new Set(ids as string[])];
    const existingListings = await Listing.find({ _id: { $in: uniqueIds } }).select('_id');
    account.savedAdIds = existingListings.map((listing) => listing._id);
    await account.save();
    res.json({ savedAdIds: account.savedAdIds.map((id) => id.toString()) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/register', authLimiter, async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
    const city = typeof req.body.city === 'string' ? req.body.city.trim() : '';

    if (name.length < 2 || name.length > 80) {
      res.status(400).json({ error: 'Enter a name between 2 and 80 characters.' });
      return;
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' });
      return;
    }
    if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
      res.status(400).json({ error: 'Password must be at least 12 characters and no more than 72 bytes.' });
      return;
    }
    if (phone.length > 32 || city.length > 80) {
      res.status(400).json({ error: 'Phone number or city is too long.' });
      return;
    }
    if (await Account.exists({ email })) {
      res.status(409).json({ error: 'An account with that email already exists.' });
      return;
    }

    const account = await Account.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      phone,
      city
    });

    await regenerateSession(req);
    req.session.userId = account._id.toString();
    await saveSession(req);
    res.status(201).json({ user: toPublicUser(account) });
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      res.status(409).json({ error: 'An account with that email already exists.' });
      return;
    }
    next(error);
  }
});

app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password || email.length > 254 || password.length > 128) {
      res.status(400).json({ error: 'Enter your email address and password.' });
      return;
    }

    const account = await Account.findOne({ email }).select('+passwordHash');
    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      res.status(401).json({ error: 'Email or password is incorrect.' });
      return;
    }

    await regenerateSession(req);
    req.session.userId = account._id.toString();
    await saveSession(req);
    res.json({ user: toPublicUser(account) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({ error: 'Could not sign out. Please try again.' });
      return;
    }
    res.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', secure: isProduction });
    res.status(204).end();
  });
});

const clientBuildPath = resolve(process.cwd(), 'dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found.' });
    return;
  }
  res.sendFile(resolve(clientBuildPath, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Request failed:', error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

await mongoose.connect(mongoUri);
const port = Number(process.env.PORT) || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`ReuseX API listening on port ${port}`);
});