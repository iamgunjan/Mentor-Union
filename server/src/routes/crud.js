import { Router } from 'express';

// Generic REST router. Mount as `/api/<name>`. Provides:
//   GET    /            list (with optional ?q=&limit=&skip=&sort=)
//   GET    /:id         read one
//   POST   /            create
//   PATCH  /:id         partial update
//   PUT    /:id         replace
//   DELETE /:id         delete
export function crudRouter(Model, opts = {}) {
  const router = Router();
  const searchFields = opts.searchFields || ['name'];

  router.get('/', async (req, res, next) => {
    try {
      const { q, limit = '500', skip = '0', sort = '-createdAt' } = req.query;
      const filter = {};
      if (q) {
        filter.$or = searchFields.map((f) => ({ [f]: { $regex: q, $options: 'i' } }));
      }
      const docs = await Model.find(filter)
        .sort(sort)
        .skip(Number(skip))
        .limit(Math.min(Number(limit), 2000))
        .lean();
      res.json(docs);
    } catch (e) {
      next(e);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id).lean();
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (e) {
      next(e);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (e) {
      next(e);
    }
  });

  router.patch('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).lean();
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (e) {
      next(e);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findOneAndReplace({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      }).lean();
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (e) {
      next(e);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id).lean();
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true, id: req.params.id });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
