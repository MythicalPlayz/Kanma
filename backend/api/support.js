import express from 'express';
import fs from 'fs';
import path from 'path';

const ppAR = fs.readFileSync(path.join(import.meta.dirname, '../support/privacyPolicyAR.txt'), 'utf8');
const ppEN = fs.readFileSync(path.join(import.meta.dirname, '../support/privacyPolicyEN.txt'), 'utf8');
const tocAR = fs.readFileSync(path.join(import.meta.dirname, '../support/termsAndConditionsAR.txt'), 'utf8');
const tocEN = fs.readFileSync(path.join(import.meta.dirname, '../support/termsAndConditionsEN.txt'), 'utf8');
const touAR = fs.readFileSync(path.join(import.meta.dirname, '../support/termsOfUseAR.txt'), 'utf8');
const touEN = fs.readFileSync(path.join(import.meta.dirname, '../support/termsOfUseEN.txt'), 'utf8');
const refundAR = fs.readFileSync(path.join(import.meta.dirname, '../support/refundAR.html'), 'utf8');
const refundEN = fs.readFileSync(path.join(import.meta.dirname, '../support/refundEN.html'), 'utf8');
const faq = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../support/faq.json'), 'utf8'));


const router = express.Router();

// GET /api/support/pp - Returns the privacy policy in Arabic & English
router.get('/pp', (req, res) => {
    const returnValue = {
        ar: ppAR,
        en: ppEN
    }
    res.json(returnValue);
});

// GET /api/support/toc - Returns the terms and conditions in Arabic & English
router.get('/toc', (req, res) => {
    const returnValue = {
        ar: tocAR,
        en: tocEN
    }
    res.json(returnValue);
});

// GET /api/support/tou - Returns the terms of use in Arabic & English
router.get('/tou', (req, res) => {
    const returnValue = {
        ar: touAR,
        en: touEN
    }
    res.json(returnValue);
});

// GET /api/support/refund - Returns the refund policy in Arabic & English
router.get('/refund', (req, res) => {
    const returnValue = {
        ar: refundAR,
        en: refundEN
    }
    res.json(returnValue);
});

// GET /api/support/faq - Returns the frequently asked questions
router.get('/faq', (req, res) => {
    res.json(faq);
});

export default router; 