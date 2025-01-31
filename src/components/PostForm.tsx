import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
    title: z.string()
        .nonempty("Title is requiered")
        .min(3, "Title must be at least 3 characters"),
    age: z.number({ invalid_type_error: "Age is requiered" })
        .int()
        .min(18)
})

type PostFormData = z.infer<typeof schema>

const PostForm: FC = () => {
    const { register, handleSubmit, formState: { errors } }
        = useForm<PostFormData>({ resolver: zodResolver(schema) });

    const onSubmit = (data: PostFormData) => {
        console.log(data)
    }

    console.log('PostForm rendered')
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='m-3'>
                <label className='form-label' htmlFor="title">Title</label>
                <input {...register('title')} className='form-control' type="text" id="title" name="title" />
                {errors.title && <p className='text-danger'>{errors.title.message}</p>}


                <label className='form-label mt-2' htmlFor="age">Age</label>
                <input  {...register('age', { valueAsNumber: true })} className='form-control' type="number" id="age" name="age" />
                {errors.age && <p className='text-danger'>{errors.age.message}</p>}

                <button className='btn btn-primary mt-3' type="submit">Submit</button>
            </div>
        </form>
    )
}

export default PostForm