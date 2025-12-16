import * as SecureStore from 'expo-secure-store';

const USERNAME_KEY = 'qption_username';
const PASSWORD_KEY = 'qption_password';

export type SavedCreds = {
  username: string | null;
  password: string | null;
};

export async function loadCredentials(): Promise<SavedCreds> {
  try {
    const [username, password] = await Promise.all([
      SecureStore.getItemAsync(USERNAME_KEY),
      SecureStore.getItemAsync(PASSWORD_KEY),
    ]);
    return { username, password };
  } catch {
    return { username: null, password: null };
  }
}

export async function saveUsername(username: string) {
  try {
    await SecureStore.setItemAsync(USERNAME_KEY, username);
  } catch {
    // ignore persistence failures
  }
}

export async function savePassword(password: string | null) {
  try {
    if (!password) {
      await SecureStore.deleteItemAsync(PASSWORD_KEY);
      return;
    }
    await SecureStore.setItemAsync(PASSWORD_KEY, password);
  } catch {
    // ignore persistence failures
  }
}
