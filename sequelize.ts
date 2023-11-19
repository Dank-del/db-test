import { Table, Column, Model, HasMany, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sequelize } from 'sequelize-typescript';

@Table
class User extends Model {
    @Column
    name: string;

    @Column
    birthday: Date;

    @HasMany(() => Post)
    posts: Post[];

    @CreatedAt
    creationDate: Date;

    @UpdatedAt
    updatedOn: Date;
}

@Table
class Post extends Model {
    @Column
    title: string;

    @Column
    content: string;

    @ForeignKey(() => User)
    @Column
    authorId: number;

    @BelongsTo(() => User)
    author: User;

    @CreatedAt
    creationDate: Date;

    @UpdatedAt
    updatedOn: Date;
}

const sequelize = new Sequelize(process.env.DATABASE_URL,{
  models: [User, Post]
});

export { sequelize, User, Post }