using System.Collections.Generic;

namespace Backend.Models
{
    public class ApiResponse<T>
    {
        public T Data { get; set; }
        public int TotalCount { get; set; }

        public ApiResponse(T data, int totalCount)
        {
            Data = data;
            TotalCount = totalCount;
        }
    }
}
