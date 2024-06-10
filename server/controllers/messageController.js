const messageModel = require('../model/messageModel.js');

module.exports.addMessage = async (req, res) => {
    try {
        const { message, from, username } = req.body;
        const data = messageModel.create({
            message: { text: message },
            from: from,
            username: username,
        });
        console.log("Message: ", message);
        console.log("From: ", from);
        console.log("Username: ", username);
        //console.log(data);

        if (data) return res.status(200).json({ message: 'Message sent', status: true });
        return res.status(400).json({ message: 'Message not sent', status: false });
    } catch (ex) {
        next(ex);
    }
};
module.exports.getMessages = async (req, res) => {
    try {
        const messages = await messageModel.find({}).sort({updatedAt: 1});
        const project = messages.map((msg) => {
            return {
                message: msg.message.text,
                from: msg.from.toString(),
                username: msg.username,
                time: msg.createdAt,
            };
        });
        res.json(project);

    } catch (err) {
        next(err);
    }
};