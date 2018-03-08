import * as mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/test');

const db = mongoose.Connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    console.log('open');
});
