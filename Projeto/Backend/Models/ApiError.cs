namespace Backend.Models
{
    public class ApiError
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }

        public ApiError(int statusCode, string message)
        {
            StatusCode = statusCode;
            Message = message;
        }
    }

}
