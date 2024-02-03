import { User } from "../types/userType";
import { db } from "../db/prisma";
import bcrypt from "bcrypt";

const hashPassword = (pass: string | null | undefined) => {
  const salt = parseInt(process.env.SALT_ROUND as string);
  return bcrypt.hashSync(`${pass}${process.env.BCRYPT_PASSWORD}`, salt);
};

export class UserModel {
  async getAllUsers(): Promise<User[]> {
    try {
      const userData = await db.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          phone: true,
          image: true,
          isValidEmail: true,
          role: true,
          created_at: true,
          updated_at: true,
          last_login: true,
        },
      });
      return userData;
    } catch (error) {
      throw new Error(`No user is found: ${error}`);
    }
  }
  async getSpecificUser(id: string): Promise<User> {
    try {
      const specificUser = await this.getUserData('',id)

      if (!specificUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      return specificUser;
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  }

  async create(info: User): Promise<User> {
    try {
      const existingEmail = await db.user.findUnique({
        where: {
          email: info.email,
        },
      });

      const existingUsername = await db.user.findUnique({
        where: {
          username: info.username,
        },
      });
      const capitalizeFirstLetterOfEachWord = (str: string): string => {
        return str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };
      if (existingUsername) {
        throw new Error(`Username '${info.username}' is already taken`);
      } else if (existingEmail) {
        throw new Error(
          `Email '${info.email}' is already taken. Try signing in.`
        );
      } else {
        const createUser = await db.user.create({
          data: {
            username: capitalizeFirstLetterOfEachWord(info.username),
            email: info.email.toLowerCase(),
            password: hashPassword(info.password),
            role: info.role,
            image: info.image,
            phone: info.phone,
            isValidEmail: info.isValidEmail,
          },
        });
        return createUser;
      }
    } catch (err) {
      console.error("Error creating user:", err);
      throw new Error(`Failed to create user: ${err}`);
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const userExist = await db.user.findUnique({
        where: {
          id,
        },
      });
      if (!userExist) {
        throw new Error(
          `user not exist may be user is already have been deleted`
        );
      }
      const deletedUser = await db.user.delete({
        where: {
          id,
        },
      });
      return deletedUser;
    } catch (err) {
      throw new Error(`Unable to delete user: ${err}`);
    }
  }
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const existingUser = await db.user.findUnique({
        where: {
          id,
        },
      });

      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      const updatedUser = await db.user.update({
        where: {
          id,
        },
        data: {
          ...updates,
        },
        select: {
          id: true,
          email: true,
          username: true,
          phone: true,
          image: true,
          isValidEmail: true,
          role: true,
          created_at: true,
          updated_at: true,
          last_login: true,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }
  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const getUserPassword = await db.user.findUnique({
        where: { email },
        select: { password: true },
      });

      if (!getUserPassword) {
        throw new Error(`Email not found`);
      }

      const { password: hashedPassword } = getUserPassword as any;
      const isPasswordValid = this.comparePasswords(password, hashedPassword);

      if (!isPasswordValid) {
        throw new Error(`Password doesn't match`);
      }

      const userData = await this.getUserData(email, '');
      return userData;
    } catch (err) {
      throw new Error(`Unable to authenticate user: ${err}`);
    }
  }

  comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    const saltedPassword = `${password}${process.env.BCRYPT_PASSWORD}`;
    return bcrypt.compare(saltedPassword, hashedPassword);
  }

  async getUserData(email: string, id: string): Promise<any> {
    if (email){

        const userData = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            username: true,
            phone: true,
            image: true,
            isValidEmail: true,
            role: true,
            created_at: true,
            updated_at: true,
            last_login: true,
          },
        });
        return userData;
    }
    if (id){
        const userData = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                username: true,
                phone: true,
                image: true,
                isValidEmail: true,
                role: true,
                created_at: true,
                updated_at: true,
                last_login: true,
            },
          });
          return userData;
    }
  }
}
