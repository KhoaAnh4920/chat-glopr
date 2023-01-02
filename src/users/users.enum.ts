export enum EmailStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum UserStatus {
  NEW = 0,
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum UserSortField {
  CREATED_TIME = 'createdAt',
  EMAIL = 'email',
}

export enum UserSortType {
  ASC = 'asc',
  DESC = 'desc',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
