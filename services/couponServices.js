const couponModel = require('../models/couponModel');


exports.getCopons = async (req, res) => {
  try{const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const copon = await couponModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: copon.length, page, data: copon });   }
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
};


exports.getCopon = async (req, res, next) => {
  
  try{const copon = await couponModel.findById(req.params.Id);
  res.status(200).json({ data: copon });   }
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
};


exports.createCopon = async (req, res) => {
  try{const copon = await couponModel.create(req.body);
  res.status(201).json({ data: copon });   }
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
};


exports.updateCopon = async (req, res, next) => {
 try{ const copon = await couponModel.findByIdAndUpdate( req.params.Id,req.body,{new:true} );
  res.status(200).json({ data: copon });   }
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
};


exports.deleteCopon = async (req, res, next) => {
    try {
         await couponModel.findByIdAndDelete(req.params.Id);
        res.status(204).send();
    }
    catch (err) { res.status(500).json({ status: "fail", error: err }); }
};