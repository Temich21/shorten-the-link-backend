const { Router } = require('express')
const Link = require('../models/Link')
const config = require('config')
const auth = require('../middleware/auth.middleware')
const shortid = require('shortid')
const router = Router()

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const { from } = req.body

        const code = shortid.generate()
        const existing = await Link.findOne({ from })

        if (existing) {
            return res.json({ link: existing })
        }

        const to = baseUrl + '/t/' + code

        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save()

        res.status(201).json({ link })
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again.' })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId })
        res.json(links)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again.' })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.json(link)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again.' })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedLink = await Link.findByIdAndDelete(req.params.id);

        if (!deletedLink) {
            return res.status(404).json({ message: 'Link not found.' });
        }

        res.status(200).json({ message: 'Link deleted successfully.' });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again.' })
    }
})

module.exports = router