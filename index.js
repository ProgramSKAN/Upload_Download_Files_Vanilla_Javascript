const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(express.static('public'));
app.use(express.text());
app.use(fileUpload());
app.use(express.raw({ type: 'image/*', limit: '5mb' }));

const port = 3000;

app.post('/api/single-file', (req, res) => {
  const contentType = req.header('content-type');
  if (contentType.includes('text/plain')) {
    res.set('Content-Type', 'text/plain');
    res.send(req.body);
  } else if (contentType.includes('multipart/form-data')) {
    const f = req.files.myfile;
    res.set('Content-Type', 'text/html');
    f.mv('./uploads/' + f.name);
    res.send(`
            <table>
                <tr><td>Name</td><td>${f.name}</td></tr>
                <tr><td>Size</td><td>${f.size}</td></tr>
                <tr><td>MIME type</td><td>${f.mimetype}</td></tr>
            </table>
        `);
  } else {
    res.set('Content-Type', contentType);
    res.send(req.body);
  }
});

app.post('/api/multi-file', (req, res) => {
  res.set('Content-Type', 'text/html');
  let response = '<table>';
  for (const f of req.files.myfiles) {
    f.mv('./uploads/' + f.name);
    response += `
                <tr>
                    <td>Name: ${f.name}</td>
                    <td>Size: ${f.size}</td>
                    <td>MIME type: ${f.mimetype}</td>
                </tr>
            `;
  }
  response += '</table>';
  res.send(response);
});

app.get('/api/download', (_req, res) => {
  //downloads jpg file in browser
  res.set('Content-Type', 'image/jpg');
  res.download('./uploads/Tesla Car.jpg', 'foo.jpg');
});

app.get('/api/sendfile', (_req, res) => {
  //jpg file is viewed on browser new tab
  res.set('Content-Type', 'image/jpg');
  res.sendFile(path.join(__dirname, 'uploads/Tesla Car.jpg'));
});

app.get('/api/attachment', (_req, res) => {
  //same as download but end() call is requied like below
  res.set('Content-Type', 'image/jpg');
  res.attachment('./uploads/Tesla Car.jpg');
  res.end();
});

app.listen(port, () =>
  console.log(`Server is running and listening on port ${port}`)
);
