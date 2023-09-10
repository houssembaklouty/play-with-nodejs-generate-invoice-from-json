const express = require('express');
const router = express.Router();
const carbone = require('carbone');
const crypto = require('crypto');
const fs = require('fs').promises;

router.post('/generate-report', async (req, res) => {
  try {
    const data = req.body;

    const md5Hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    const reportName = `invoice_${md5Hash}.xlsx`;

    // Load the Carbone template
    const templatePath = './templates/invoice_template.odt';

    carbone.render(templatePath, data, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating report' });
        return;
      }

      await fs.writeFile(`./build/${reportName}`, result);

      console.log(`Report generated: ${reportName}`);
      res.status(200).json({ message: `Report generated: ${reportName}` });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
