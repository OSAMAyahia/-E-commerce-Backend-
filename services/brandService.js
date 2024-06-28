const slugify = require('slugify');
const Brand = require('../models/brandModel');


exports.getBrands = async (req, res) => {
  try{const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });   }
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
};


exports.getBrand = async (req, res, next) => {
  
  try{const brand = await Brand.findById(req.params.Id);
  res.status(200).json({ data: brand });   }
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
};


exports.createBrand = async (req, res) => {
  try{const brand = await Brand.create({ name:req.body.name, slug: slugify(req.body.name) ,image:req.body.image});
  res.status(201).json({ data: brand });   }
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
};


exports.updateBrand = async (req, res, next) => {
 try{ const brand = await Brand.findByIdAndUpdate( req.params.Id,req.body,{new:true} );
  res.status(200).json({ data: brand });   }
  catch (err) { res.status(500).json({ status: "fail", error: err }); }
};


exports.deleteBrand = async (req, res, next) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.Id);
        res.status(204).send();
    }
    catch (err) { res.status(500).json({ status: "fail", error: err }); }
};