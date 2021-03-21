const roomService = require('../services/room_service');
const hotelService = require('../services/hotel_service');
const userService = require('../services/user_service')
const express = require('express');
const router = express.Router();
const Role = require('../helpers/role');
const authorize = require('../helpers/authorize')

router.get('/:hotelId', authorize(), getAvailableRoomsByHotelId);
router.post('/:currentUserId/:roomId', authorize(Role.User), bookRoom);

module.exports = router;

async function getAvailableRoomsByHotelId(req, res, next) {
    hotelService.getHotelById(req.params.hotelId)
    .then(hotel => {
        if (hotel.rooms === undefined || hotel.rooms.length == 0) {
            return res.status(400).json({message: "No rooms"});
        }
        roomService.getRoomsByHotelId(hotel.id)
        .then(rooms => res.json(rooms))
        .catch(err => next(err))
    })
}

async function bookRoom(req, res, next) {
    roomService.getRoomById(req.params.roomId)
    .then(room => {
        if (!room.available) {
            return res.status(400).json({message: "Room not available"});
        }
        roomService.updateRoomAvailability(room.id, req.params.currentUserId) // , req.params.currentUserId
        //     .then(room => res.json(room))
        //     .catch(err => next(err))


        userService.updateToGuest(req.params.currentUserId, room.id)
            .then(room => res.json(room))
            .catch(err => next(err))


        // .then(updatedRoom => {
        //     userService.updateToGuest(req.params.currentUserId, updatedRoom)
        //     .then(updatedRoom => res.json(updatedRoom))
        //     .catch(err => next(err))
        // })
    })
}