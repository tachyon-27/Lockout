import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Editor } from '@tinymce/tinymce-react';
import { cn } from "@/lib/utils";
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

const AddTournament = () => {
  const form = useForm()

  const { toast } = useToast()

  const defaultValue = form.getValues("content")

  const submit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("startDate", data.startDate);
    formData.append("content", data.content);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/admin/add-tournament`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Event added Successfully!",
        description: "The event has been successfully created.",
      });

      console.log("Response from server:", response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Something went wrong!";
      toast({
        title: "Could Not Add Event!",
        description: errorMessage,
      });
      console.error("Error while submitting:", error);
    }
  };


  const [popOverOpen, setPopOverOpen] = useState(false);

  const popoverRef = useRef(null);

  // Close popover if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopOverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <>
      <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-1 lg:grid-cols-[69%_29%] gap-4 m-4 p-5">
        <div className="p-6 rounded-lg shadow-md">
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <LabelInputContainer>
                <Label className="text-white">Title</Label>
                <Input
                  {...field}
                  type="text"
                  placeholder='Title'
                  required
                />
              </LabelInputContainer>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <LabelInputContainer>
                <Label className="text-white mt-2">Summary (To Be displayed to user)</Label>
                <Input
                  {...field}
                  type="text"
                  placeholder='Description'
                  required
                />
              </LabelInputContainer>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[49%_49%] md:gap-3 lg:grid-cols-1 p-6 rounded-lg shadow-md">

          <Controller
            control={form.control}
            name="startDate"
            rules={{ required: "Start Date is required" }} // Add the required validation rule
            render={({ field, fieldState }) => (
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
                  <PopoverContent
                    ref={popoverRef}
                    className="w-full sm:w-auto p-0"
                    align="start">
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
                {fieldState?.invalid && fieldState?.error?.type === "required" && (
                  <p className="text-red-500 text-sm">{fieldState?.error?.message}</p>
                )}
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
                  required
                />
              </LabelInputContainer>
            )}
          />

        </div>
        <div className="grid grid-cols-1 p-6 rounded-lg shadow-md lg:col-span-2 gap-y-2">
          <Label className="text-white text-lg">Content</Label>
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
        <div className="flex justify-center items-center lg:col-span-2">
          <button type="submit" className="text-white bg-blue-900 px-6 py-2 rounded-md">
            Submit
          </button>
        </div>
      </form>
    </>
  )
}

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

export default AddTournament