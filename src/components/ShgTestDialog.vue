<template>
  <BaseDialog :id="componentName" title="Preview File">
    <ShgForm ref="form" :columns="1">
      <ShgTextField v-model="data.firstName" label="First Name" :required="true" />
      <ShgTextField v-model="data.lastName" label="Last Name" :required="true" />
      <ShgTextField v-model="data.email" label="Email" :required="true" :rules="['email']" />
    </ShgForm>

    <template v-slot:actions>
      <ShgButton type="submit" @click="submit" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { BaseDialog, ShgButton, ShgForm, type ShgFormRef } from 'erp-template-vuetify-components';
import { onMounted, ref, toRefs } from 'vue';
import { closeDialog } from 'vue3-promise-dialog';

const componentName = 'ShgTestDialog';
defineOptions({
  name: componentName,
});

const props = defineProps<{
  email?: string;
}>();

const { email } = toRefs(props);

const form = ref<ShgFormRef>();

const data = ref({
  firstName: '',
  lastName: '',
  email: '',
});

const submit = async () => {
  const isValid = await form.value?.validate();
  if (isValid) {
    closeDialog(data.value);
  }
};

onMounted(() => {
  if (email.value) {
    data.value.email = email.value;
  }
});
</script>
