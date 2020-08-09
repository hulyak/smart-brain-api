const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'c5799ad4c8dd4d7ca5099a331b35f299',
});

const handleApiCall = (req, res) => {
  app.models
    // Clarifai recently changed their API and looks like they have merged the face detect model into the demographics model.
    // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
    .then(data => {
    res.json(data)
    })
  .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall
};
