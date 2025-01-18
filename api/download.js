const https = require('https');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { url: fileUrl, filename } = req.query;

    if (!fileUrl || !filename) {
      res.status(400).send('Bad Request: Missing file URL or filename');
      return;
    }

    https.get(fileUrl, (response) => {
      if (response.statusCode === 200) {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
        response.pipe(res);
      } else {
        res.status(response.statusCode).send(`Failed to fetch file: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      res.status(500).send(`Error: ${err.message}`);
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
