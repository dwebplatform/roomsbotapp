

const { Apartment } = require('../models');
const paginate = require('express-paginate');
const rootPath = require('app-root-path');
const uid = require('uniqid');










exports.deleteImageByIndex = async (req, res) => {

    let { apartmentId, imageIndex } = req.body;
    if ((typeof apartmentId === 'undefined') || (typeof imageIndex === 'undefined')) {
        return res.json({
            status: 'error',
            msg: "не удалось удалить фотографию 1"
        })
    }
    try {
        let curentApartment = await Apartment.findOne({
            where: {
                id: apartmentId,
            }
        })
        if (!(curentApartment instanceof Apartment)) {
            return res.json({
                status: 'error',
                msg: "не удалось найти квартиры с данным id "
            });
        }
        let images = curentApartment.images || [];
        let imagesResult = images.filter((item, index) => index != imageIndex);
        curentApartment.images = imagesResult;
        try {
            await curentApartment.save();
            return res.json({
                status: 'ok',
                msg: 'succefully saved'
            });
        } catch (e) {
            return res.json({
                status: 'error',
                msg: "не удалось удалить фотографию"
            })
        }

    } catch (e) {
        return res.json({
            status: 'error',
            msg: "не удалось удалить фотографию"
        })

    }

    return res.json({
        status: 'ok',
        msg: 'image deleted by index'
    })
}



const loadAsync = async (file, path) => {
    file.mv(`${rootPath}/server/public${path}`, (err) => {
        if (err) {
            throw new Error('не удалось загрузить данную фотографию');
        }
    });
}

async function getImagesForApartment(imageInstances) {
    let imagePaths = [];
    for (let key in imageInstances) {
        let curPath = '/img/__APARTMENT_UID' + uid();
        try {
            await loadAsync(imageInstances[key], curPath);
            imagePaths.push(curPath);
        } catch (e) {
        }
    }
    return imagePaths;
}


exports.getApartmentById = async (req, res) => {
    let { apartmentId } = req.params;
    try {
        let curApartment = await Apartment.findOne({
            where: {
                id: apartmentId
            },
            //TODO: включить  метро
        });
        if (!curApartment) {
            return res.json({
                status: 'error',
                msg: 'не удалось комнаты с данным id'
            });
        }
        return res.json({
            status: 'ok',
            apartment: curApartment
        });
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'не удалось найти комнаты с данным id'
        });
    }
    return res.json({
        status: 'ok',
        msg: 'Now you get the result'
    })
}

exports.createApartment = async (req, res) => {

    let { address, isVip, roomAmount, price } = req.body;
    isVip = parseInt(isVip);

    if (!address || !roomAmount || !price) {
        return res.json({
            status: 'error',
            msg: 'Не все поля заполнены'
        });
    }

    if (!req.files) {
        return res.json({
            status: 'error',
            msg: 'no msg given'
        });
    }



    let allPaths = await getImagesForApartment(req.files);
    // create apartment
    try {
        let newApartmentInstance = await Apartment.create({
            address,
            isVip: !!isVip,
            roomAmount: roomAmount || 1,
            price: price,
            images: allPaths
        });
        if (!newApartmentInstance) {
            return res.json({
                status: 'error',
                msg: 'не удалось создать квартиру'
            })
        }
        return res.json({
            status: 'ok',
            msg: 'успешно создана новая квартира'
        });

    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'не удалось создать новую квартиру'
        });
    }


    //     for (let key in imageInstances) {
    //         let curImageName = 'public/img/' + uid();
    //         imageInstances[key].mv(`${rootPath}/server/${curImageName}`, function (err) {
    //             if (err) {
    //                 console.log(err);
    //             } else {

    //                 console.log(imageStrNames);
    //             }
    //         });
    //     }
    // }
    // for (let key in imageInstances) {
    //     let myFile = imageInstances[key];
    //     console.log(myFile.mimetype);
    //     let [mime, type] = myFile.mimetype.split('/');
    //     // if (type !== 'jpg' || type !== 'jpeg') {
    //     //     continue;
    //     // }
    //     let curImageName = `public/img/_APARTMENT_${myFile.name + uid()}`;
    //     myFile.mv(`${rootPath}/server/${curImageName}`, function (err) {
    //         if (err) {
    //             console.log(err);
    //         } else {

    //             console.log(imageStrNames);
    //             imageStrNames.push(curImageName);
    //         }
    //     });
    // }
    // return res.json({
    //     status: 'ok',
    //     msg: 'наверное загрузилось'
    // })
    //  mv() method places the file inside public directory

}
exports.allApartmentsWithoutPaggination = async (req, res) => {
    let allapartments = [];
    try {
        allapartments = await Apartment.findAll();
    } catch (e) {
        return res.json({
            status: 'error'
        })
    }
    return res.json({
        status: 'ok',
        apartments: allapartments
    });
};
exports.allApartments = async (req, res) => {
    let filterObject = {
        limit: req.query.limit, offset: req.skip,
        where: {}
    };
    let allApartments = await Apartment.findAndCountAll(filterObject);
    const itemCount = allApartments.count;
    const pageCount = Math.ceil(allApartments.count / (req.query.limit || 1));
    return res.json({
        status: 'ok',
        apartments: allApartments.rows,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
    });
}