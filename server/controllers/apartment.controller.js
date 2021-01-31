

const { Apartment } = require('../models');
const paginate = require('express-paginate');
const rootPath = require('app-root-path');
const uid = require('uniqid');
const loadAsync = async (file, path) => {
    file.mv(`${rootPath}/server/public/${path}`, (err) => {
        if (err) {
            throw new Error('не удалось загрузить данную фотографию');
        }
    });
}

async function getImagesForApartment(imageInstances) {
    let imagePaths = [];
    for (let key in imageInstances) {
        let curPath = 'img/__APARTMENT_UID' + uid();
        try {
            await loadAsync(imageInstances[key], 'img/__APARTMENT__UID__' + uid());
            imagePaths.push(curPath);
        } catch (e) {
        }
    }
    return imagePaths;
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
            images: JSON.stringify(allPaths)
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