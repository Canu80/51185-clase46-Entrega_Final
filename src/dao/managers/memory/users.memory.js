export class UsersMemory {
  constructor() {
    this.users = [];
  }

  getUsers() {
    const users = this.users;
    return {
      code: 202,
      status: "Success",
      message: users,
    };
  }
}
