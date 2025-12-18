import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function useProducts() {
    const api = useApi()
    const result = useQuery(
        {
            queryKey: ["products"],
            queryFn: async () => {
                const { data } = await (await api).get<Product[]>("/products")
                return data
            }
        }
    )
    return result;
}