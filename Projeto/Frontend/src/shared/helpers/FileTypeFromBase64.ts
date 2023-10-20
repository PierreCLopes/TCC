function detectFileTypeFromBase64(base64String: string): string {
    const upperCaseBase64 = base64String.toUpperCase();

    if (upperCaseBase64.startsWith("IVBOR", 0)) {
        return "png";
    } else if (upperCaseBase64.startsWith("/9J/4", 0)) {
        return "jpg";
    } else if (upperCaseBase64.startsWith("AAAAF", 0)) {
        return "mp4";
    } else if (upperCaseBase64.startsWith("JVBER", 0)) {
        return "pdf";
    } else if (upperCaseBase64.startsWith("AAABA", 0)) {
        return "ico";
    } else if (upperCaseBase64.startsWith("UMFYI", 0)) {
        return "rar";
    } else if (upperCaseBase64.startsWith("E1XYD", 0)) {
        return "rtf";
    } else if (upperCaseBase64.startsWith("U1PKC", 0)) {
        return "txt";
    } else if (upperCaseBase64.startsWith("MQOWM", 0) || upperCaseBase64.startsWith("77U/M", 0)) {
        return "srt";
    } else {
        return "";
    }
}

export { detectFileTypeFromBase64 };