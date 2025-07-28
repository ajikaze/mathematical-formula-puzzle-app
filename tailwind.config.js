/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // 数式ピースのカテゴリー別色分け
                "basic-symbols": "#3B82F6", // 青色系 - 基本記号
                functions: "#10B981", // 緑色系 - 関数・構造
                calculus: "#8B5CF6", // 紫色系 - 微積分・総和
                "empty-blocks": "#6B7280", // グレー系 - 空ブロック
            },
        },
    },
    plugins: [],
};
