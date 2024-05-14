import mongoose, { Model } from 'mongoose';

class MongoFunctions {
  getSingleData(
    model: Model<any>,
    condition: any = {},
    fields: any = {},
    populateArr: any = [],
  ) {
    try {
      return model.findOne(condition, fields).populate(populateArr).lean();
    } catch (error) {
      throw Error(error.message);
    }
  }
  getCount(
    model: Model<any>,
    condition: any = {},
  ) {
    try {
      return model.countDocuments(condition);
    } catch (error) {
      throw Error(error.message);
    }
  }
  getData(
    model: Model<any>,
    condition: any = {},
    fields: any = {},
    skip : number = 0,
    limit : number = 0,
    populateArr: any = [],
  ) {
    try {
      return model.find(condition, fields).skip(skip).limit(limit).populate(populateArr).lean();
    } catch (error) {
      throw Error(error.message);
    }
  }
  async saveData(
    model: Model<any>, data : any){
    try {
      return await new model(data).save();
    } catch (error) {
      throw Error(error.message);
    }
  }
  async updateById(model: Model<any>, id: mongoose.Types.ObjectId, data: any) {
    try {
      return await model.findByIdAndUpdate(
        { _id: id },
        {
          $set: data,
        },
        { new: true },
      ).lean();
    } catch (error) {
      throw Error(error.message);
    }
  }
}

export const DB = new MongoFunctions();
