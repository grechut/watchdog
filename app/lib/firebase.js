import Firebase from 'firebase';

const ref = new Firebase(process.env.FIREBASE_URL);

export default ref;
