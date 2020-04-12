const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt); 

class UsersRepository extends Repository{
    
    async comparePassword(saved,supplied){
        
        const [hashed,salt] = saved.split('.');

        const hashedSuplliedBuffer = await scrypt(supplied,salt,64);

        return hashed === hashedSuplliedBuffer.toString('hex');
    }

    async create(attrs){

        attrs.id = this.randomId();

        const records = await this.getAll();

        const record = {...attrs,password:`${hashedBuffer.toString('hex')}.${salt}`};

        records.push(record);

       await this.writeAll(records);

       return record;
    }
}

module.exports = new UsersRepository('users.json');