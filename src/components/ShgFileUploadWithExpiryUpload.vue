<template>
  <BaseDialog title="Upload File" width="600">
    <template v-slot:default>
      <ShgForm :columns="2" ref="form">
        <ShgDatePicker v-model="values.date" label="Date" :required="true" />
        <ShgFileUpload v-model="values.file" label="File" :required="true" />
      </ShgForm>
    </template>
    <template v-slot:actions>
      <BaseButton color="secondary" @click="handleCloseDialog">Cancel</BaseButton>
      <BaseButton color="primary" @click="onSubmit">Upload</BaseButton>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import useShgForm from '@/composables/shg-use-form';
import { DocumentService } from '@/services/document.service';
import { BaseButton, BaseDialog, ShgDatePicker, ShgFileUpload, ShgForm } from 'erp-template-vuetify-components';
import { closeDialog } from 'vue3-promise-dialog';

type FormDTO = {
  file: File;
  date: string;
};

const { form, handleSubmit, values } = useShgForm<FormDTO>({});

const onSubmit = handleSubmit(async (value) => {
  console.log(value);

  const response = await DocumentService.uploadFileWithExpired(value.file, value.date);

  if (response.error) {
    console.log(response.error);
    return;
  }

  closeDialog({
    id: response.data._id,
    date: value.date,
    fileName: value.file.name,
  });
});

const handleCloseDialog = () => {
  closeDialog(null);
};
</script>
