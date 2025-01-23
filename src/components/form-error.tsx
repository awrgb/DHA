import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface FormErrorProps {
  message?: string
  action?: {
    label: string
    onClick: () => void
    loading?: boolean
  }
}

export const FormError = ({ message, action }: FormErrorProps) => {
  if (!message) return null

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    action?.onClick()
  }

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <div className="flex-grow">{message}</div>
      {action && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleActionClick}
          disabled={action.loading}
          className="h-auto p-1 px-2 text-xs font-semibold hover:bg-destructive/10 border border-destructive"
        >
          {action.loading ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  )
}
