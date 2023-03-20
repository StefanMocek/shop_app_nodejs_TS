export interface AddProductToCartDto {
  userId: string,
  quantity: number,
  productId: string
};

export interface CreateCartProductDto {
  cartId: string,
  quantity: number,
  productId: string
}