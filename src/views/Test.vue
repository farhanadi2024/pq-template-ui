<template>
  <div>
    <p>value</p>
    <pre>
			{{ values }}
		</pre
    >
    <p>erros</p>
    <pre>
			{{ form?.form.errors }}
		</pre
    >
    <ShgForm :columns="1" ref="form">
      <!--<ShgTextField  field-name="asd" v-model="values.firstName" label="First Name"  :required="true" />
       <ShgTextField v-model="values.lastName" label="Last Name" :required="true" />
      <ShgTextField v-model="values.email" label="Email" :required="true" :rules="['email']" />
      <ShgTextarea v-model="values.address" label="Address" :required="true" /> -->
      <ShgFileUploadWithExpiry
        v-model="values.fileWithExpiredDate"
        name="fileWithExpiredDate"
        :required="true"
        label="File with Expiry Date"
      />
      <ShgFileUploadWithExpiry
        v-model="values.fileWithExpiredDateNew"
        name="fileWithExpiredDateNew"
        label="File with Expiry Date"
      />
    </ShgForm>

    <div class="mt-5" />

    <ShgButton type="submit" @click="onSubmit"></ShgButton>
  </div>
</template>

<script setup lang="ts">
import ShgFileUploadWithExpiry from '@/components/ShgFileUploadWithExpiry.vue';
import useShgForm from '@/composables/shg-use-form';
import { ShgButton, ShgForm } from 'erp-template-vuetify-components';
import { onMounted } from 'vue';

const { form, handleSubmit, values } = useShgForm({
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    fileWithExpiredDate: [],
    fileWithExpiredDateNew: [],
  },
});

const onSubmit = handleSubmit(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.log('error', error);
  },
);

onMounted(async () => {
  // const { data, error } = await fetchQuestions();
  // if (error) {
  //   console.log(error);
  //   return;
  // }
  // console.log(data);
});
</script>

<style scoped></style>
