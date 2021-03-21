const hotelService = require('../services/hotel_service');
const userService = require('../services/user_service');
const Role = require('../helpers/role');
const express = require('express');
const router = express.Router();
const authorize = require('../helpers/authorize')

router.get('/:hotelId', authorize(), getHotelById);
router.post('/:currentUserId/addHotel',authorize(Role.Manager), createHotel)
router.post('/:currentUserId/:hotelId/addRoom', authorize(Role.Manager), createRoom)
// router.get('/:hotelId/rooms', getAvailableRoomsByHotelId)

module.exports = router;


async function createHotel(req, res, next) {
    hotelService.addHotel(req.body.name, req.body.country, req.params.currentUserId)
    .then(hotel => res.json(hotel))
    .catch(err => next(err))
} 

async function getHotelById(req, res, next) {
    hotelService.getHotelById(req.params.hotelId)
    .then(hotel => res.json(hotel))
    .catch(err => next(err))
}

async function createRoom(req, res, next) {
    hotelService.getHotelById(req.params.hotelId)
        .then(hotel => {
            if(hotel.managerId != req.params.currentUserId){
                return res.status(401).json({message: 'Unauthorized'});
            }
            hotelService.addRoom(req.body.number, hotel.name, req.params.hotelId)
            .then(room => res.json(room))
            .catch(err => next(err))
            // hotelService.updateHotelRooms(hotel.id, room)
        })
}

// async function getAvailableRoomsByHotelId(req, res, next) {
//     // hotelService.get
// }