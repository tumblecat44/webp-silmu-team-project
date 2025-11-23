import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
  lastLoginAt: any;
}

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  }

  // Google 로그인
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const user = result.user;

      // 사용자 프로필 문서 생성/업데이트
      await this.createOrUpdateUserProfile(user);

      // 토스트 메시지는 LoginModal에서 처리하므로 여기서는 제거
      return user;
    } catch (error: any) {
      console.error('Google 로그인 실패:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('로그인이 취소되었습니다.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      } else {
        throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }

  // 이메일/비밀번호 로그인
  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // 마지막 로그인 시간 업데이트
      await this.updateLastLogin(user.uid);

      toast.success('로그인되었습니다!');
      return user;
    } catch (error: any) {
      console.error('이메일 로그인 실패:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('등록되지 않은 이메일입니다.');
        case 'auth/wrong-password':
          throw new Error('비밀번호가 일치하지 않습니다.');
        case 'auth/invalid-email':
          throw new Error('유효하지 않은 이메일 주소입니다.');
        case 'auth/too-many-requests':
          throw new Error('너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
        default:
          throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }

  // 이메일/비밀번호 회원가입
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // 프로필 업데이트
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // 사용자 프로필 문서 생성
      await this.createOrUpdateUserProfile(user);

      toast.success('회원가입이 완료되었습니다!');
      return user;
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('이미 사용 중인 이메일입니다.');
        case 'auth/invalid-email':
          throw new Error('유효하지 않은 이메일 주소입니다.');
        case 'auth/weak-password':
          throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
        default:
          throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      // 토스트 메시지는 호출하는 쪽에서 처리
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw new Error('로그아웃에 실패했습니다.');
    }
  }

  // 사용자 프로필 문서 생성/업데이트
  private async createOrUpdateUserProfile(user: User): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const profileData: Partial<UserProfile> = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '익명 사용자',
        photoURL: user.photoURL || undefined,
        lastLoginAt: serverTimestamp(),
      };

      if (!userSnap.exists()) {
        // 새 사용자: 생성 시간 추가
        await setDoc(userRef, {
          ...profileData,
          createdAt: serverTimestamp(),
        });
      } else {
        // 기존 사용자: 마지막 로그인 시간만 업데이트
        await setDoc(userRef, profileData, { merge: true });
      }
    } catch (error) {
      console.error('사용자 프로필 저장 실패:', error);
      // 프로필 저장 실패는 치명적이지 않으므로 에러를 던지지 않음
    }
  }

  // 마지막 로그인 시간 업데이트
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('마지막 로그인 시간 업데이트 실패:', error);
    }
  }

  // 사용자 프로필 조회
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('사용자 프로필 조회 실패:', error);
      return null;
    }
  }

  // 인증 상태 변경 리스너
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // 현재 사용자
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export const authService = new AuthService();
export default authService;