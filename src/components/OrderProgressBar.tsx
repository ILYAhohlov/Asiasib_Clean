import { Check, ShoppingCart, ClipboardList } from "lucide-react";

interface OrderProgressBarProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Корзина", icon: ShoppingCart },
  { id: 2, name: "Оформление заказа", icon: ClipboardList },
];

export function OrderProgressBar({ currentStep }: OrderProgressBarProps) {
  return (
    <div className="w-full bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav aria-label="Прогресс оформления заказа">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className="flex-1">
                <div className="flex items-center">
                  <div className="flex items-center text-sm">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shadow-sm ${
                        currentStep > step.id
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-500 text-white shadow-green-200"
                          : currentStep === step.id
                          ? "border-primary text-primary bg-gradient-to-r from-blue-50 to-indigo-50 shadow-blue-100"
                          : "border-gray-300 text-muted-foreground bg-gray-50"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <step.icon className="w-4 h-4" aria-hidden="true" />
                      )}
                    </span>
                    <span
                      className={`ml-3 font-medium transition-colors duration-300 ${
                        currentStep > step.id ? "text-green-600" :
                        currentStep === step.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {stepIdx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 ml-4 rounded-full transition-all duration-500 ${
                        currentStep > step.id ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm" : "bg-gray-200"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}