import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Editor } from '@tinymce/tinymce-react';
import { cn } from "@/lib/utils";
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

const AddTournament = () => {
  const form = useForm({
    defaultValues: {
      content: "",
      title: "",
      startDate: "",
    }
  })

  const defaultValue = form.getValues("content")

  const submit = async (data) => {
    console.log(data);
  }

  const [popOverOpen, setPopOverOpen] = useState(false);

  return (
    <>
      <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-1 lg:grid-cols-[69%_29%] gap-4 m-4 p-5">
        <div className="bg-blue-500 p-6 rounded-lg shadow-md">
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <LabelInputContainer>
                <Label>Title</Label>
                <Input
                  {...field}
                  type="text"
                  placeholder='Title'
                  className="h-auto"
                  required
                />
              </LabelInputContainer>
            )}
          />
        </div>
        <div className="p-6 rounded-lg shadow-md">

          <Controller
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <div className="flex flex-col w-full gap-2 mb-2">
                <Label className="text-white">Start Date</Label>
                <Popover open={popOverOpen}>
                  <PopoverTrigger asChild>
                    <div>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={() => setPopOverOpen(true)}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-full sm:w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setPopOverOpen(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          />


          <Controller
            name="image"
            control={form.control}
            render={({ field: { onChange } }) => (
              <LabelInputContainer>
                <Label className="text-white">Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                />
              </LabelInputContainer>
            )}
          />

        </div>
        <div className="bg-red-500 p-6 rounded-lg shadow-md lg:col-span-2 gap-2">
          <Label>Content</Label>
          <Controller
            name="content"
            control={form.control}
            render={({ field: { onChange } }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                initialValue={defaultValue}
                init={{
                  initialValue: defaultValue,
                  height: 500,
                  menubar: true,
                  plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                  ],
                  toolbar:
                    "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                  content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                }}
                onEditorChange={onChange}
              />
            )}
          />
        </div>
        <button type="submit" className='text-white bg-green-500'>Submit</button>
      </form>
    </>
  )
}

export default AddTournament
const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
