import mongoose from 'mongoose';
const messageModel = mongoose.model('message');

// GET Request Handler for messages
const getAllMessages = async (req, res) => {
  try {
    let messages = await messageModel.find({}, '', { sort: { _id: -1 } }).exec();
    res.status(200).json(messages);
  } catch (err) {
    res
      .status(400)
      .send('Bad Request.');
  }
};

// POST Request Handler
const addNewMessage = async (req, res) => {
  try {

    // adds message
    // responds with '201 Created' Status Code and the message, as JSON,
    // in the body of the response
    let message = await messageModel.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    res
      .status(400)
      .send('Bad Request. The message in the body of the \
      Request is either missing or malformed.');
  }
};

// PATCH Request, add a message
const updateMessage = async (req, res) => {
  try {
    let message = await messageModel.findById(req.params.messageId).exec();
    if (!message) {
      // there wasn't an error, but the message wasn't found
      // (the id given doesn't match any in the database)
      res.sendStatus(404);
    } else {
      // message found - is the user authorized?
      if (message.name === req.user.username) {
        // auth user is owner of message, proceed w/ update
        message.msgText = req.body.msgText;
        await message.save();
        // sends 204 No Content
        res.sendStatus(204);
      } else {
        // auth user is not owner, unauthorized
        res.sendStatus(401);
      }
    }
  } catch (error) {
    res.sendStatus(400);
  }
}

// DELETE
const deleteMessage = async (req, res) => {
  try {
    let message = await messageModel.findById(req.params.messageId).exec();
    if (!message) {
      // there wasn't an error, but the message wasn't found
      res.sendStatus(404);
    } else {
      // message found - is the user authorized?
      if (message.name === req.user.username) {
        // auth user is owner of message, proceed w/ delete
        await message.deleteOne();
        // send back 204 No Content
        res.sendStatus(204);
      } else {
        // auth user is not owner, unauthorized
        res.sendStatus(401);
      }
    }
  } catch (error) {
    res.sendStatus(400);
  }
}

export { getAllMessages, addNewMessage, updateMessage, deleteMessage };