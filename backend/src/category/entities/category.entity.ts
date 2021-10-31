import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  cateName: string;

  @OneToMany(() => Product, (product) => product.category, { eager: true })
  @Field(() => [Category])
  product: Product[];
}
