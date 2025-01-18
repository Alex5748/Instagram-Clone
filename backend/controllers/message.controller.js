 
import {Conversation} from '../models/conversation.model.js'
import { Message } from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

// for chatting


export const SendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;
    

       

        // const senderObjectId = mongoose.Types.ObjectId(senderId);
        // const receiverObjectId = mongoose.Types.ObjectId(receiverId);
        
        let conversation = await Conversation.findOne({
            participations:{$all:[senderId, receiverId]}
        });

        


        // establish the conversation if not started

        if (!conversation) {
            conversation = await Conversation.create({
                participations: [senderId, receiverId]
            });
        };

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if (newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()])


        



        // implementing socket for real time data transfer

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }


        return res.status(201).json({
            success: true,
            newMessage
        })

        
    } catch (error) {
        console.log(error)
        
    }
}


// export const getMessage = async (req, res) => {
//     try {
//         console.log("This get message function was triggered!");

//         const senderId = req.id;
//         const receiverId = req.params.id;

//         // Ensure IDs are valid ObjectIds
//         const senderObjectId = new mongoose.Types.ObjectId(senderId);
//         const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

//         const conversation = await Conversation.findOne({
//             participations: { $all: [senderObjectId, receiverObjectId] }
//         }).populate('messages');

//         //console.log("The conversation message access: ", conversation?.messages);

//         if (!conversation) {
//             return res.status(200).json({ success: true, messages: [] });
//         }

//         return res.status(200).json({
//             success: true,
//             messages: conversation?.messages,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             error: "An error occurred while retrieving messages.",
//         });
//     }
// };
export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participations:{$all: [senderId, receiverId]}
        }).populate('messages');
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
        
    } catch (error) {
        console.log(error);
    }
}
