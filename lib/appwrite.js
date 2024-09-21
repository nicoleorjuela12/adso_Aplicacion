import { Account, Client, ID, Avatars, Databases, Query } from 'react-native-appwrite';
import { Alert } from 'react-native';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.sena.aora',
    projectId: '66ede921000246650614',
    databaseId: '66edebcc003a3094b41c',
    userCollectionId: '66edec130029152a277f',
    videosCollectionId: '66edec4f0027e94a79a2',
    storageId: '66edef230023a0d3792c'
};


const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videosCollectionId, // Ensure this is included if needed
    storageId
} = appwriteConfig;


const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
    try {
        if (!username) {
            Alert.alert('Error', 'Username is required');
            throw new Error('Username is required');
        }

        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) {
            Alert.alert('Error', 'Account creation failed');
            throw new Error('Account creation failed');
        }

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                cuentaid: newAccount.$id,
                correo: email,
                nombre: username,
                avatar: avatarUrl,
            }
        );

        Alert.alert('Success', 'Account created successfully');
        return newUser;
    } catch (error) {
        Alert.alert('Error', error.message);
        console.error(error);
        throw new Error(`Error: ${error.message}`);
    }
}

// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createSession(email, password);
        Alert.alert('Success', 'Session started successfully');
        return session;
    } catch (error) {
        Alert.alert('Sign In Error', error.message);
        throw new Error(`Sign In Error: ${error.message}`);
    }
}

// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        Alert.alert('Error', 'Could not get account');
        throw new Error(error);
    }
}

// Get Current User
export async function getCurrentUser() {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("cuentaid", await getAccount().then(account => account.$id))]
        );

        if (!users.documents.length) throw new Error('No user found');

        return users.documents[0];
    } catch (error) {
        Alert.alert('Error', error.message);
        return null;
    }
}

export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosCollectionId // Use videosCollectionId instead of videoCollectionId
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
