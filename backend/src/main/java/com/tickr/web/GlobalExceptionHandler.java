package com.tickr.web;

import com.tickr.provider.RateLimitException;
import com.tickr.provider.SymbolNotFoundException;
import com.tickr.provider.UpstreamException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Translates exceptions into a uniform {@link ApiError} body with an appropriate status. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(SymbolNotFoundException.class)
    public ResponseEntity<ApiError> notFound(SymbolNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiError("symbol_not_found", e.getMessage(), false));
    }

    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ApiError> rateLimited(RateLimitException e) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(new ApiError("rate_limited",
                        "The market data provider is rate-limiting us. Please try again shortly.", true));
    }

    @ExceptionHandler(UpstreamException.class)
    public ResponseEntity<ApiError> upstream(UpstreamException e) {
        log.warn("Upstream failure: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ApiError("upstream_unavailable",
                        "Market data is temporarily unavailable. Please try again shortly.", true));
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            ConstraintViolationException.class,
            MissingServletRequestParameterException.class,
            MissingRequestHeaderException.class
    })
    public ResponseEntity<ApiError> badRequest(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError("bad_request", e.getMessage(), false));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> invalidBody(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream().findFirst()
                .map(fe -> fe.getField() + " " + fe.getDefaultMessage())
                .orElse("Invalid request body");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiError("bad_request", msg, false));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> unexpected(Exception e) {
        log.error("Unexpected error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError("internal_error", "Something went wrong.", false));
    }
}
