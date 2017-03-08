
var config = require('../../config.js')

exports.doc = function (req, res){
	var options = { root: config.raiz + '/app/' }
	res.sendFile('index.html', options, function (err) {
		if (err) return res.status(500).json({
			status: 500,
			err: "Falta index.html"
		})
		res.status(200).end()
	})
}

exports.restrict = function (req, res) {
	res.status(406).json({
		status: 406,
		err: 'No Aceptable'
	})
}