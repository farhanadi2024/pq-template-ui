<template>
  <BaseDialog title="Update Detail" width="600">
    <template v-slot:default>
      <ShgForm :columns="1" ref="form">
        <ShgDatePicker v-model="values.date" label="Date" :field-name="`date`" :required="true" />
      </ShgForm>
    </template>

    <template v-slot:actions>
      <BaseButton color="secondary" @click="handleCloseDialog">Cancel</BaseButton>
      <BaseButton color="primary" @click="onSubmit">Update</BaseButton>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import useShgForm from '@/composables/shg-use-form';
import { DocumentService } from '@/services/document.service';
import { BaseButton, BaseDialog, ShgDatePicker, ShgForm } from 'erp-template-vuetify-components';
import { closeDialog } from 'vue3-promise-dialog';

const props = defineProps<{
  fileId?: string;
  date?: string;
}>();

type FormDTO = {
  date: string;
};

const { form, handleSubmit, values } = useShgForm<FormDTO>({
  initialValues: {
    date: props.date!,
  },
});

const onSubmit = handleSubmit(async (value) => {
  const response = await DocumentService.updateExpiredAt(props.fileId!, value.date);

  if (response.error) {
    console.log(response.error);
    return;
  }

  closeDialog({
    date: value.date,
  });
});

const handleCloseDialog = () => {
  closeDialog(null);
};
</script>

<style scoped>
.error-message {
  color: #b34c5f;
  font-size: 12px;
  margin-top: 6px;
  margin-left: 16px;
}
</style>
