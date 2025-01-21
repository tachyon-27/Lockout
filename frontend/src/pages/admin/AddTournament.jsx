import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Editor } from '@tinymce/tinymce-react';
import { cn } from "@/lib/utils";
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import dayjs from 'dayjs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { BeatLoader } from 'react-spinners';

import axios from "axios";
import { useSearchParams } from 'react-router-dom';


const AddTournament = ({ isEditing }) => {

  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");

  const form = useForm({
    defaultValues: {
      title: '',
      summary: '',
      startDate: '',
      startTime: '',
      description: '',
      coverImage: null,
    },
  });

  const { toast } = useToast()
  const [popOverOpen, setPopOverOpen] = useState(false);
  const popoverRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    if (isEditing && tournamentId) {
      (async () => {
        try {
          const response = await axios.post(`/api/tournament/get-tournament`, {
            _id: tournamentId
          });
          const data = response.data;
          const startDateTime = dayjs(data.startDate);

          form.reset({
            title: data.data.title,
            summary: data.data.summary,
            startDate: startDateTime.format('YYYY-MM-DD'),
            startTime: startDateTime,
            description: data.data.description,
          });

          setExistingImage(data.coverImage);
        } catch (error) {
          console.error('Error fetching tournament data:', error);
          toast({
            title: 'Error Fetching Data',
            description: 'Failed to load tournament details. Please try again later.',
          });
        }
      })();
    }
  }, [isEditing, tournamentId, form, toast]);

  const submit = async (data) => {
    setIsLoading(true);
    console.log(data)
    const dateObject = dayjs(data.startDate).format('YYYY-MM-DD') + ' ' + dayjs(data.startTime).format('HH:mm');
    const date = dayjs(dateObject).toDate();
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('startDate', date);
    formData.append('description', data.description);
    formData.append('summary', data.summary);

    console.log(data.coverImage)
    
    try {
      if (data.coverImage && data.coverImage[0]) {
        formData.append('coverImage', data.coverImage[0]);
      } else formData.append('coverImage', existingImage);
      console.log(formData.get('coverImage'))
      const endpoint = isEditing ? `/api/tournament/update-tournament/${tournamentId}` : `/api/tournament/add-tournament`;
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      setIsLoading(false);
      toast({
        title: 'Success!',
        description: isEditing ? 'Event updated successfully.' : 'Event created successfully.',
      });
    } catch (error) {
      console.log(error)
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
      toast({
        title: 'Error!',
        description: errorMessage,
      });
    }
  };

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={form.handleSubmit(submit)} className="grid grid-cols-1 lg:grid-cols-[69%_29%] gap-4 m-4 p-5 text-white">
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
                    className="bg-gray-600 border-none text-white placeholder:text-white"
                    required
                  />
                </LabelInputContainer>
              )}
            />
            <Controller
              name="summary"
              control={form.control}
              render={({ field }) => (
                <LabelInputContainer>
                  <Label className="text-white mt-2">Summary (To Be displayed to user)</Label>
                  <Input
                    {...field}
                    type="text"
                    placeholder='Description'
                    className="bg-gray-600 border-none text-white placeholder:text-white"
                    required
                  />
                </LabelInputContainer>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[49%_49%] md:gap-3 lg:grid-cols-1 p-6 rounded-lg shadow-md">
            <div className='grid grid-cols-[49%_49%] rounded-lg gap-2'>

              <Controller
                control={form.control}
                name="startDate"
                rules={{ required: "Start Date is required" }} // Add the required validation rule
                render={({ field, fieldState }) => (
                  <div className="flex flex-col w-full gap-2 mb-2">
                    <Label className="text-white">Start Date</Label>
                    <Popover open={popOverOpen}>
                      <PopoverTrigger asChild>
                        <div
                          className="bg-gray-600 border-none text-white placeholder:text-white rounded-md"
                        >
                          <Button
                            variant={"outline"}
                            type="button"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                              "bg-gray-600 border-none text-white placeholder:text-white hover:bg-gry-600 rounded-md"
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
                          className={cn(
                            "bg-gray-700 text-white border-none"
                          )}
                          onSelect={(date) => {
                            field.onChange(date);
                            setPopOverOpen(false);
                          }}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
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

              <div>

                <Controller
                  name="startTime"
                  control={form.control}
                  rules={{ required: "Start Time is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Label className="text-white">Start Time</Label>
                      <MobileTimePicker
                        value={field.value || null} // Ensure this is always either a valid time or null
                        onChange={field.onChange}
                        className="bg-gray-600 text-white w-full" // Adjust width and background
                        sx={{
                          '& .MuiInputLabel-root': { color: 'white' },
                          '& .MuiInputBase-root': {
                            backgroundColor: '#4b5563',
                            borderRadius: '4px',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'white',
                          },
                        }}
                        TextFieldComponent={(params) => (
                          <Input
                            {...params}
                            error={!!fieldState.error}
                            helperText={fieldState?.error?.message}
                            className="bg-gray-600 border-none text-white placeholder:text-white"
                          />
                        )}
                      />
                      {fieldState?.invalid && fieldState?.error?.type === "required" && (
                        <p className="text-red-500 text-sm">{fieldState?.error?.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

            </div>


            <Controller
              name="coverImage"
              control={form.control}
              render={({ field: { onChange } }) => (
                <LabelInputContainer>
                  <Label className="text-white">Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    className="bg-gray-600 border-none text-white placeholder:text-white"
                    {...(!isEditing && { required: true })}
                  />
                </LabelInputContainer>
              )}
            />

          </div>
          <div className="grid grid-cols-1 p-6 rounded-lg shadow-md lg:col-span-2 gap-y-2">
            <Label className="text-white text-lg">Content</Label>
            <Controller
              name="description"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  initialValue={value}
                  init={{
                    initialValue: value,
                    height: 500,
                    menubar: true,
                    skin: 'oxide-dark',
                    content_css: 'dark',
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
              {
                isLoading ? (
                  <BeatLoader size={10} color="#36D7B7" />
                ) : (
                  <>Submit</>
                )
              }
            </button>
          </div>
        </form>
      </LocalizationProvider>
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