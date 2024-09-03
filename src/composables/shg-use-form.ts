import type { ShgFormRef } from 'erp-template-vuetify-components';
import { ref, toRaw } from 'vue';

type IUseForm<T> = {
  initialValues?: T;
};
const useShgForm = <T extends object>({ initialValues }: IUseForm<T>) => {
  const form = ref<ShgFormRef>();

  const values = ref<T>(initialValues ?? ({} as T));

  type IHandleSubmitSuccess = (values: T) => void;

  const handleSubmit = (onSuccess: IHandleSubmitSuccess, onError?: (error: Record<string, string>) => void) => {
    return async () => {
      const isValid = await form.value?.validate();
      if (isValid) {
        onSuccess(toRaw(values.value) as T);
        return;
      }
      onError?.(form.value!.form.errors as unknown as Record<string, string>);
    };
  };

  return {
    form,
    values,
    handleSubmit,
  };
};

export default useShgForm;
