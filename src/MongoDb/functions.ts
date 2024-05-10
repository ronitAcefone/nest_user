import  { Model} from 'mongoose';

class MongoFunctions {
  getSingleData(model: Model<any>, condition: any = {}, fields: any = {}) {
    try {
      return model.findOne(condition, fields);
    } catch (error) {
      throw Error(error.message);
    }
  }
  getData(model: Model<any>, condition: any = {}, fields: any = {}) {
    try {
      return model.find(condition, fields);
    } catch (error) {
      throw Error(error.message);
    }
  }
}

export const DB = new MongoFunctions();
