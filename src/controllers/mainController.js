const db = require('../database/models');
const { Op } = require('sequelize')
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		// Do the magic
		let inSale = db.Product.findAll({
			where: {
				discount: {
					[Op.gt]: 10
				}
			},
			include: ['images', 'category']
		});

		let newest = db.Product.findAll({
			order: [
				['createdAt', 'DESC']
			],
			limit: 4,
			include: ['images', 'category']
		})

		let home = db.Category.findByPk(1,{
				include: [
					{
						association : 'products',
						include : ['images'],
						limit : 4
					}
				]
			})

		Promise.all([inSale, newest, home])
			.then(([inSale, newest, home]) => {
				return res.render('index', {
					inSale,
					newest,
					home,
					toThousand
				})
			})
			.catch(error => console.log(error))
	},
	search: (req, res) => {
		// Do the magic
		const {keywords} = req.query;

		db.Product.findAll({
			where : {
				[Op.or] : [
					{
						name: {
							[Op.substring]: keywords
						}
					},
					{
						description: {
							[Op.substring]: keywords
						}
					}
				]
			},
			include : ['images']
		})
			.then(products => {
				return res.render('results', {
					products,
					keywords,
					toThousand
				})
			})
			.catch(error => console.log(error))

	},
};

module.exports = controller;
