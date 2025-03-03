interface ApiResponse<T>{
    errorMessage?: string;
    responseCode?: number;
    data?: T;
}

export default ApiResponse;