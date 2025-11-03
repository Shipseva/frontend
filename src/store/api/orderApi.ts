import { createApi } from "@reduxjs/toolkit/query/react";
import { CreateOrderRequest, CreateOrderResponse, Order } from "@/types/order";
import { createBaseQueryWithToasts } from "./baseQuery";
import { getApiUrl } from "@/config/apiConfig";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: createBaseQueryWithToasts(getApiUrl("ORDERS")),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Get all orders for the authenticated user
    getOrders: builder.query<{
      orders: Order[];
      total: number;
      page: number;
      limit: number;
    }, {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.status) searchParams.append('status', params.status);
        if (params.search) searchParams.append('search', params.search);
        
        return `?${searchParams.toString()}`;
      },
      providesTags: ["Order"],
    }),

    // Get a specific order by ID
    getOrder: builder.query<Order, string>({
      query: (orderId) => orderId,
      providesTags: (result, error, orderId) => [{ type: "Order", id: orderId }],
    }),

    // Create a new order
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (orderData) => ({
        url: "",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<{ message: string }, {
      orderId: string;
      status: string;
    }>({
      query: ({ orderId, status }) => ({
        url: `${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        "Order"
      ],
    }),

    // Cancel an order
    cancelOrder: builder.mutation<{ message: string }, string>({
      query: (orderId) => ({
        url: `${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
        "Order"
      ],
    }),

    // Get order tracking information
    getOrderTracking: builder.query<{
      orderId: string;
      trackingNumber: string;
      status: string;
      currentLocation?: string;
      estimatedDelivery?: string;
      trackingHistory: Array<{
        status: string;
        location?: string;
        timestamp: string;
        description: string;
      }>;
    }, string>({
      query: (orderId) => `${orderId}/tracking`,
      providesTags: (result, error, orderId) => [{ type: "Order", id: orderId }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useGetOrderTrackingQuery,
} = orderApi;
