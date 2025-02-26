import { Component } from "react";
import { FaRegSadCry } from "react-icons/fa";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white text-center p-10">
          <div className="flex items-center justify-center mb-8">
            <FaRegSadCry className="text-6xl mr-4" />
            <h1 className="text-5xl font-semibold">Oops! Something went wrong</h1>
          </div>
          <p className="text-xl mb-8">
            An unexpected error occurred. Please try again later.
          </p>
          <Link
            to="/"
            className="px-8 py-3 bg-purple-600 text-white rounded-md text-xl hover:bg-purple-700 transition-colors"
          >
            Go to Home
          </Link>
          <p className="mt-4 text-lg text-gray-400">
            Or refresh the page and try again.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;